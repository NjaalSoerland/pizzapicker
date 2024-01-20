import React, { useState, ReactNode } from 'react';
import style from './tabmenu.module.css';

export type Tab = {
    name: string;
    content: ReactNode;
};

type TabMenuProps = {
    tabs: Tab[];
};

const TabMenu: React.FC<TabMenuProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].name);

    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className={style.tabMenuContainer}>
            <div className={style.tabButtons}>
                {tabs.map(tab => (
                    <button 
                        key={tab.name}
                        className={`${style.tabButton} ${tab.name === activeTab ? style.activeTab : ''}`}
                        onClick={() => handleTabChange(tab.name)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            <div className={style.tabContent}>
                {tabs.find(tab => tab.name === activeTab)?.content}
            </div>
        </div>
    );
}

export default TabMenu;
