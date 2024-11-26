import { FC } from "react";
import { RoofCheckContent } from "./RoofCheckContent";

interface RoofCheckProps {
  address?: string;
  onLog?: (message: string) => void;
}

export const RoofCheck: FC<RoofCheckProps> = ({ address, onLog }) => {
  return <RoofCheckContent address={address} onLog={onLog} />;
};