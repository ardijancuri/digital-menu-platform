import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/ImageUpload';

const ProductsPage = () => {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'mk', label: 'Macedonian' },
        { code: 'sq', label: 'Albanian' },
        { code: 'tr', label: 'Turkish' },
    ];

    const emptyTranslations = languages.reduce((acc, lang) => {
        acc[lang.code] = { name: '', description: '' };
        return acc;
    }, {});

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        category_id: '',
        price: '',
        translations: emptyTranslations,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedNameLang, setSelectedNameLang] = useState('en');
    const [selectedDescLang, setSelectedDescLang] = useState('en');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsRes, categoriesRes] = await Promise.all([
                userAPI.getMenuItems(),
                userAPI.getCategories(),
            ]);
            setItems(itemsRes.data.items);
            setCategories(categoriesRes.data.categories);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            category_id: categories[0]?.id || '',
            price: '',
            translations: emptyTranslations,
        });
        setImageFile(null);
        setImagePreview(null);
        setSelectedNameLang('en');
        setSelectedDescLang('en');
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            category_id: item.category_id,
            price: item.price,
            translations: languages.reduce((acc, lang) => {
                const translation = item?.translations?.[lang.code] || {};
                acc[lang.code] = {
                    name:
                        translation.name ||
                        item?.[`name_${lang.code}`] ||
                        (lang.code === 'en' ? item.name : ''),
                    description:
                        translation.description ||
                        item?.[`description_${lang.code}`] ||
                        (lang.code === 'en' ? item.description || '' : ''),
                };
                return acc;
            }, {}),
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const translationsPayload = languages.reduce((acc, lang) => {
                const t = formData.translations[lang.code] || {};
                if (t.name || t.description) {
                    acc[lang.code] = {
                        ...(t.name ? { name: t.name } : {}),
                        ...(t.description ? { description: t.description } : {}),
                    };
                }
                return acc;
            }, {});

            const payload = {
                category_id: formData.category_id,
                price: formData.price,
                name: translationsPayload.en?.name || '',
                description: translationsPayload.en?.description || '',
                translations: translationsPayload,
                // Legacy per-language fields for backward compatibility
                name_mk: translationsPayload.mk?.name,
                name_sq: translationsPayload.sq?.name,
                name_tr: translationsPayload.tr?.name,
                description_mk: translationsPayload.mk?.description,
                description_sq: translationsPayload.sq?.description,
                description_tr: translationsPayload.tr?.description,
            };

            let itemId;
            if (editingItem) {
                const response = await userAPI.updateMenuItem(editingItem.id, payload);
                itemId = response.data.item.id;
            } else {
                const response = await userAPI.createMenuItem(payload);
                itemId = response.data.item.id;
            }

            // Upload image if provided (replace existing if any)
            if (imageFile) {
                setUploadingImage(true);
                // If editing and there's an existing image, delete it first
                if (editingItem && editingItem.images && editingItem.images.length > 0) {
                    try {
                        await userAPI.deleteItemImage(editingItem.id, editingItem.images[0]);
                    } catch (err) {
                        console.error('Failed to delete old image:', err);
                        // Continue with upload even if delete fails
                    }
                }
                await userAPI.uploadItemImage(imageFile, itemId);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Failed to save item');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await userAPI.deleteMenuItem(id);
            fetchData();
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (categories.length === 0) {
        return (
            <div className="card text-center py-12">
                <p className="text-gray-500">Please create categories first before adding products.</p>
            </div>
        );
    }

    const getLocalized = (entity, field) => {
        // For dashboard, always show English first
        if (entity?.translations?.en?.[field]) return entity.translations.en[field];
        if (entity?.[`${field}_en`]) return entity[`${field}_en`];
        // If base field exists and _mk version is different, base field is likely English
        if (entity[field] && entity[`${field}_mk`] && entity[field] !== entity[`${field}_mk`]) {
            return entity[field];
        }
        // If _mk exists and equals base field, then base field is Macedonian, so don't use it for English
        if (entity[`${field}_mk`] && entity[field] === entity[`${field}_mk`]) {
            // English is always the fallback, but if base field is Macedonian, return empty or try other languages
            // Try other languages as fallback only if English doesn't exist
            if (entity?.translations?.mk?.[field]) return entity.translations.mk[field];
            if (entity?.[`${field}_mk`]) return entity[`${field}_mk`];
            return '';
        }
        // Base field is likely English
        return entity[field] || '';
    };

    const categorized = categories.map(cat => ({
        ...cat,
        items: items.filter(item => item.category_id === cat.id)
    }));

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu Items</h2>
                <Button onClick={handleCreate} variant="primary">
                    + Add Item
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No menu items yet. Create your first one!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {categorized.map(category => (
                        <div key={category.id} className="card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold">{getLocalized(category, 'name')}</h3>
                                    <p className="text-xs text-gray-500">{category.items.length} item{category.items.length === 1 ? '' : 's'}</p>
                                </div>
                            </div>
                            {category.items.length === 0 ? (
                                <p className="text-sm text-gray-500">No items in this category yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm flex gap-3 flex-col sm:flex-row">
                                            <div className="w-full sm:w-32 aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <i className="fas fa-image text-xl"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h4 className="font-semibold text-sm truncate">{getLocalized(item, 'name')}</h4>
                                                        <p className="text-xs text-gray-500 truncate">ID: {item.id}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-blue-600 text-sm">{`${Math.round(parseFloat(item.price))} MKD`}</p>
                                                    </div>
                                                </div>
                                                {getLocalized(item, 'description') && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{getLocalized(item, 'description')}</p>
                                                )}
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Button onClick={() => handleEdit(item)} variant="secondary" className="text-xs px-3 py-2">
                                                        Edit
                                                    </Button>
                                                    <Button onClick={() => handleDelete(item.id)} variant="danger" className="text-xs px-3 py-2">
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Menu Item' : 'New Menu Item'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4 items-end">
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="input"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{getLocalized(cat, 'name')}</option>
                                ))}
                            </select>
                        </div>

                        {/* Item Name with Language Selector */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                <select
                                    value={selectedNameLang}
                                    onChange={(e) => setSelectedNameLang(e.target.value)}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                                {selectedNameLang === 'en' && <span className="text-red-500">*</span>}
                            </div>
                            <Input
                                value={formData.translations[selectedNameLang]?.name || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        translations: {
                                            ...prev.translations,
                                            [selectedNameLang]: {
                                                ...prev.translations[selectedNameLang] || {},
                                                name: e.target.value,
                                            },
                                        },
                                    }))
                                }
                                required={selectedNameLang === 'en'}
                                placeholder={`Enter item name in ${languages.find(l => l.code === selectedNameLang)?.label}`}
                            />
                        </div>

                        {/* Description with Language Selector */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <select
                                    value={selectedDescLang}
                                    onChange={(e) => setSelectedDescLang(e.target.value)}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                                {selectedDescLang !== 'en' && <span className="text-xs text-gray-500">(optional)</span>}
                            </div>
                            <Input
                                value={formData.translations[selectedDescLang]?.description || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        translations: {
                                            ...prev.translations,
                                            [selectedDescLang]: {
                                                ...prev.translations[selectedDescLang] || {},
                                                description: e.target.value,
                                            },
                                        },
                                    }))
                                }
                                placeholder="Short description"
                            />
                        </div>

                        <Input
                            label="Price *"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                            <div className="flex items-start gap-4">
                                {/* Existing Image Preview */}
                                {(imagePreview || editingItem?.images?.[0]) && (
                                    <div className="relative group flex-shrink-0">
                                        <img 
                                            src={imagePreview || editingItem.images[0]} 
                                            alt="Product" 
                                            className="w-32 h-32 object-cover rounded-lg border" 
                                        />
                                        {editingItem?.images?.[0] && !imageFile && (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (confirm('Remove this image?')) {
                                                        try {
                                                            await userAPI.deleteItemImage(editingItem.id, editingItem.images[0]);
                                                            const updatedItem = { ...editingItem, images: [] };
                                                            setEditingItem(updatedItem);
                                                            setImagePreview(null);
                                                            fetchData();
                                                        } catch (err) {
                                                            alert('Failed to remove image');
                                                        }
                                                    }
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Upload Section */}
                                <div className="flex-1">
                                    <ImageUpload
                                        onUpload={(file) => {
                                            setImageFile(file);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImagePreview(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                        currentImage={imagePreview || editingItem?.images?.[0] || null}
                                        label={editingItem?.images?.[0] || imagePreview ? "Replace Image" : "Upload Image"}
                                    />
                                    {imageFile && <p className="text-xs text-green-600 mt-1">Image selected: {imageFile.name}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <Button type="submit" variant="primary" loading={uploadingImage} className="flex-1">
                            Save
                        </Button>
                        <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductsPage;
