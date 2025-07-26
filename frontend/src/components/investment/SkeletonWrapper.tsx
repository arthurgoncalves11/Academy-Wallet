import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingWrapperProps {
  loading: boolean;
  skeletonWidth?: string;
  skeletonHeight?: string;
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  skeletonWidth = "100px",
  skeletonHeight = "20px",
  children,
}) => {
  return loading ? (
    <Skeleton
      style={{
        width: skeletonWidth,
        height: skeletonHeight,
      }}
      className="rounded-md my-1 bg-gradient-to-r from-[#E2E8F0]  to-[#E6ECF4]"
    />
  ) : (
    <>{children}</>
  );
};

export default LoadingWrapper;
