const ColorPicker = ({ label, value, onChange, name }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex items-center space-x-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    name={name}
                    className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    name={name}
                    className="input flex-1"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                />
            </div>
        </div>
    );
};

export default ColorPicker;
