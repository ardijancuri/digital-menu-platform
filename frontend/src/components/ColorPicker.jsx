const ColorPicker = ({ label, value, onChange, name }) => {
    return (
        <div className="mb-3">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <div className="flex items-center space-x-2 md:space-x-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    name={name}
                    className="h-10 w-14 md:h-12 md:w-20 cursor-pointer"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    name={name}
                    className="input flex-1 text-sm py-2"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                />
            </div>
        </div>
    );
};

export default ColorPicker;
