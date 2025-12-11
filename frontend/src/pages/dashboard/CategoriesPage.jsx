import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

const CategoriesPage = () => {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'mk', label: 'Macedonian' },
        { code: 'sq', label: 'Albanian' },
        { code: 'tr', label: 'Turkish' },
    ];
    const emptyTranslations = languages.reduce((acc, lang) => {
        acc[lang.code] = '';
        return acc;
    }, {});

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        position: 0,
        translations: emptyTranslations,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await userAPI.getCategories();
            setCategories(response.data.categories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            position: categories.length,
            translations: emptyTranslations,
        });
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            position: category.position,
            translations: languages.reduce((acc, lang) => {
                const value =
                    category?.translations?.[lang.code]?.name ||
                    category?.[`name_${lang.code}`] ||
                    (lang.code === 'en' ? category?.name : '');
                acc[lang.code] = value || '';
                return acc;
            }, {}),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const translationsPayload = languages.reduce((acc, lang) => {
                const nameValue = formData.translations[lang.code]?.trim();
                if (nameValue) {
                    acc[lang.code] = { name: nameValue };
                }
                return acc;
            }, {});

            const payload = {
                position: formData.position,
                name: translationsPayload.en?.name || '',
                translations: translationsPayload,
                // Legacy per-language fields for backward compatibility
                name_mk: translationsPayload.mk?.name,
                name_sq: translationsPayload.sq?.name,
                name_tr: translationsPayload.tr?.name,
            };

            if (editingCategory) {
                await userAPI.updateCategory(editingCategory.id, payload);
            } else {
                await userAPI.createCategory(payload);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category? All items in it will also be deleted.')) return;
        try {
            await userAPI.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const getLocalizedCategoryName = (category) => {
        // For dashboard, always show English first
        if (category?.translations?.en?.name) return category.translations.en.name;
        if (category?.name_en) return category.name_en;
        // If base name exists and name_mk is different, base name is likely English
        if (category.name && category.name_mk && category.name !== category.name_mk) {
            return category.name;
        }
        // If name_mk exists and equals name, then name is Macedonian, so don't use it for English
        if (category.name_mk && category.name === category.name_mk) {
            // English is always the fallback, but if base name is Macedonian, return empty or try other languages
            // Try other languages as fallback only if English doesn't exist
            if (category?.translations?.mk?.name) return category.translations.mk.name;
            if (category?.name_mk) return category.name_mk;
            return '';
        }
        // Base name is likely English
        return category.name || '';
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Button onClick={handleCreate} variant="primary">
                    + Add Category
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No categories yet. Create your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {category.position}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">{getLocalizedCategoryName(category)}</h3>
                                    <p className="text-xs text-gray-500">Position: {category.position}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => handleEdit(category)} variant="secondary" className="text-xs px-3 py-2">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(category.id)} variant="danger" className="text-xs px-3 py-2">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'New Category'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3">
                        {languages.map((lang) => (
                            <Input
                                key={lang.code}
                                label={`Category Name (${lang.label})${lang.code === 'en' ? ' *' : ''}`}
                                value={formData.translations[lang.code]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        translations: { ...prev.translations, [lang.code]: e.target.value },
                                    }))
                                }
                                required={lang.code === 'en'}
                            />
                        ))}
                    </div>
                    <Input
                        label="Position"
                        type="number"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                        required
                    />
                    <div className="flex space-x-2">
                        <Button type="submit" variant="primary" className="flex-1">
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

export default CategoriesPage;
