
import * as React from "react";

import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

import { MenuItemDefinition } from "./MenuItemDefinition";

export interface AppDrawerProps {
    open: boolean;
    requestOpenChange: (open: boolean) => void;
    menuItems: MenuItemDefinition[];
    clickMenuItem: (menuItem: MenuItemDefinition) => void;
}

export const AppDrawer = (props: AppDrawerProps) => {

    const menuItems = props.menuItems.map((mi) => {
        return <MenuItem key={mi.id} onClick={() => props.clickMenuItem(mi)}>{mi.title}</MenuItem>;
    });

    return (
        <Drawer open={props.open} docked={false} onRequestChange={props.requestOpenChange}>
            {menuItems}
        </Drawer>
    );
};
