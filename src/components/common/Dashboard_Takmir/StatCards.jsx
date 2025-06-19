const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ease-in-out">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-90 shadow-inner`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
        {count.toLocaleString()}
      </h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  </div>
);

export default StatCard;
