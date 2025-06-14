import { useState, useEffect, useRef } from "react";

import "./ThemeSelector.css";

function ThemeSelector() {

    const themes = {
        dark: {
            name: "Темна",
            "--bg-color": "#121212",
            "--header-color": "#1e1e1e",
            "--block-color": "#2a2a2a",
            "--text-color": "#ffffff",
        },
        light: {
            name: "Світла",
            "--bg-color": "#f5f5f5",
            "--header-color": "#ffffff",
            "--block-color": "#e0e0e0",
            "--text-color": "#000000",
        },
        sepia: {
            name: "Сепія",
            "--bg-color": "#f4ecd8",
            "--header-color": "#e5dec6",
            "--block-color": "#ddd2b4",
            "--text-color": "#4b3b2a",
        },
        blue: {
            name: "Синя",
            "--bg-color": "#0d1117",
            "--header-color": "#161b22",
            "--block-color": "#21262d",
            "--text-color": "#c9d1d9",
        },
        lightGreen: {
            name: "Світло-зелений",
            "--bg-color": "#ECFAE5",
            "--header-color": "#CAE8BD",
            "--block-color": "#B0DB9C",
            "--text-color": "#364f2a",
        },
        darkGreen: {
            name: "Темно-зелений",
            "--bg-color": "#12372A",
            "--header-color": "#436850",
            "--block-color": "#ADBC9F",
            "--text-color": "#FBFADA",
        },
        lightBlue: {
            name: "Небо",
            "--bg-color": "#E3FDFD",
            "--header-color": "#A6E3E9",
            "--block-color": "#71C9CE",
            "--text-color": "#2f7174",
        },
        whiteToBlue: {
            name: "Біло-синій",
            "--bg-color": "#F9F7F7",
            "--header-color": "#3F72AF",
            "--block-color": "#DBE2EF",
            "--text-color": "#112D4E",
        },
        gray: {
            name: "Сірий",
            "--bg-color": "#F0F5F9",
            "--header-color": "#C9D6DF",
            "--block-color": "#52616B",
            "--text-color": "#1E2022",
        },
        dardNight: {
            name: "Темна ніч",
            "--bg-color": "#070F2B",
            "--header-color": "#1B1A55",
            "--block-color": "#535C91",
            "--text-color": "#9290C3",
        },
        hs: {
            name: "Зірки",
            "--bg-color": "#222831",
            "--header-color": "#00ADB5",
            "--block-color": "#393E46",
            "--text-color": "#EEEEEE",
        },
        redSummer: {
            name: "Червона пора",
            "--bg-color": "#FFD1D1",
            "--header-color": "#FFE3E1",
            "--block-color": "#FFF5E4",
            "--text-color": "#FF9494",
        },
        
    };



    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(localStorage.getItem("theme") || "dark");
    const ref = useRef(null);

    const applyTheme = (key) => {
        const theme = themes[key];
        Object.entries(theme).forEach(([prop, value]) => {
            document.documentElement.style.setProperty(prop, value);
        });
        localStorage.setItem("theme", key);
        setSelected(key);
    };


    useEffect(() => {
        applyTheme(selected);
    }, []);


    useEffect(() => {
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setVisible(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div className="themeSelector" ref={ref}>
            <div className="selectorButton">
                <div
                    className="themeColorDisplay"
                    onClick={() => setVisible((v) => !v)}
                    style={{ backgroundColor: `var(--bg-color)` }}
                    title={themes[selected].name}
                />
            </div>

            {visible && (
                <div className="themeList">
                {Object.entries(themes).map(([key, theme]) => (
                    <div
                        key={key}
                        className={`themeItem ${selected === key ? "selected" : ""}`}
                        style={{ backgroundColor: theme["--block-color"] }}
                        onClick={() => {
                            applyTheme(key);
                            setVisible(false);
                        }}
                        /*title={theme.name}*/
                    >
                        
                        <div
                            className="themeColorDisplay"
                            style={{ 
                                backgroundColor: theme["--bg-color"], 
                                width: 18 + "px",
                                height: 18 + "px",
                            }}
                            /*title={themes[selected].name}*/
                        />
                        <div  
                            className="themeName"
                            style={{color: theme["--text-color"] }}
                        >
                            {theme.name}

                        </div>

                        
                    </div>
                ))}
                </div>
            )}

            {/*visible && (
                <div className="themeList">
                {Object.entries(themes).map(([key, theme]) => (
                    <div
                        key={key}
                        className={`themeItem ${selected === key ? "selected" : ""}`}
                        style={{ backgroundColor: theme["--bg-color"] }}
                        onClick={() => {
                            applyTheme(key);
                            setVisible(false);
                        }}
                        title={theme.name}
                    >
                        {theme.name}
                    </div>
                ))}
                </div>
            )*/}
        </div>
    );
}

export default ThemeSelector;
