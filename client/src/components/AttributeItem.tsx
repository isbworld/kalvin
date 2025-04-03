interface AttributeItemProps {
  label: string;
  value: number;
  min: string;
  max: string;
}

const AttributeItem = ({ label, value, min, max }: AttributeItemProps) => {
  const percentage = (value / 10) * 100;

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-center">
        <span className="text-lg font-medium text-gray-900 mr-2">{value}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default AttributeItem;
