
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  color = 'primary'
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              <span className="mr-1">
                {trend.isPositive ? '▲' : '▼'}
              </span>
              {trend.value}% {trend.isPositive ? 'increase' : 'decrease'}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-full bg-${color}/10 text-${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
