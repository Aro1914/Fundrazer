import React from "react";
import { createRoot } from "react-dom/client";
import { useReach } from "../hooks";

export function renderDOM (app) {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
        <React.StrictMode>{ app }</React.StrictMode>
    );
}

const RenderViews = (Views) => {
    const { views } = useReach();
    const View = Views[views.view];
    const Wrapper = views.wrapper ? Views[views.wrapper] : Views["AppWrapper"];

    const content = <View />;
    return <Wrapper>{ content }</Wrapper>;
};

export default RenderViews;