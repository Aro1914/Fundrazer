import * as AppViews from "./components/App";
import * as Attacher from "./components/Attacher";
import * as Deployer from "./components/Deployer";
import * as Player from "./components/Player";
import RenderViews, { renderDOM } from "./layouts/renderViews";
import ReachContextProvider from "./context/ReachContext";
// import styles from "./styles/Global.module.css";
import { useClasses } from "./hooks";

const Views = {
    ...AppViews,
    ...Attacher,
    ...Deployer,
    ...Player,
};

function App () {
    return (
        <div className={ useClasses() }>
            <RenderViews { ...Views } />
        </div>
    );
}

renderDOM(
    <ReachContextProvider>
        <App />
    </ReachContextProvider>
);

export default App;
