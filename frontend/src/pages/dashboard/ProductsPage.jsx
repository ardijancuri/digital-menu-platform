import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/ImageUpload';

const ProductsPage = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        price: '',
        tag: '',
    });
    const [imageFile, setImageFile] = useState(null);

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
            name: '',
            description: '',
            price: '',
            tag: '',
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            category_id: item.category_id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            tag: item.tag || '',
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let itemId;
            if (editingItem) {
                const response = await userAPI.updateMenuItem(editingItem.id, formData);
                itemId = response.data.item.id;
            } else {
                const response = await userAPI.createMenuItem(formData);
                itemId = response.data.item.id;
            }

            // Upload image if provided
            if (imageFile) {
                setUploadingImage(true);
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="card">
                            {item.image_url && (
                                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                            )}
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                {item.tag && (
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <p className="text-lg font-bold text-blue-600 mb-2">${parseFloat(item.price).toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mb-3">Category: {item.category_name}</p>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleEdit(item)} variant="secondary" className="flex-1 text-sm">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(item.id)} variant="danger" className="flex-1 text-sm">
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
                title={editingItem ? 'Edit Menu Item' : 'New Menu Item'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="input"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Item Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows="3"
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

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                        <select
                            value={formData.tag}
                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            className="input"
                        >
                            <option value="">None</option>
                            <option value="New">New</option>
                            <option value="Hot">Hot</option>
                            <option value="Bestseller">Bestseller</option>
                        </select>
                    </div>

                    <ImageUpload
                        onUpload={(file) => setImageFile(file)}
                        currentImage={editingItem?.image_url}
                        label="Item Image"
                    />

                    <div className="flex space-x-2">
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
