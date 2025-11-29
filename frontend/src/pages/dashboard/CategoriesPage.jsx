import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', position: 0 });

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
        setFormData({ name: '', position: categories.length });
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, position: category.position });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await userAPI.updateCategory(editingCategory.id, formData);
            } else {
                await userAPI.createCategory(formData);
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
                <div className="grid gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="card flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{category.name}</h3>
                                <p className="text-sm text-gray-600">Position: {category.position}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleEdit(category)} variant="secondary">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(category.id)} variant="danger">
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
                    <Input
                        label="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
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
