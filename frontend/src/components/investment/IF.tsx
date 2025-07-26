import { FC, JSX, ReactNode } from "react";

type Props = {
    children: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
    condition: boolean;
};
export const If: FC<Props> = ({ children, condition }) =>
    condition ? <>{children}</> : null;
