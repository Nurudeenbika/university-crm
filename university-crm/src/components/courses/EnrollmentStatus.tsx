import React from "react";
import { Check, Clock, X, AlertCircle } from "lucide-react";
import { EnrollmentStatus as Status } from "../../types";

interface EnrollmentStatusProps {
  status: Status;
  className?: string;
}

export const EnrollmentStatus: React.FC<EnrollmentStatusProps> = ({
  status,
  className = "",
}) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "enrolled":
        return {
          icon: Check,
          text: "Enrolled",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          iconColor: "text-green-600",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600",
        };
      case "rejected":
        return {
          icon: X,
          text: "Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          iconColor: "text-red-600",
        };
      case "dropped":
        return {
          icon: AlertCircle,
          text: "Dropped",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          iconColor: "text-gray-600",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          iconColor: "text-gray-600",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <Icon className={`w-3 h-3 mr-1 ${config.iconColor}`} />
      {config.text}
    </span>
  );
};

export default EnrollmentStatus;
