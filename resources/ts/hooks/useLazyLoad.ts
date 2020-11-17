import { ReactElement, SetStateAction, useEffect, useState } from 'react';

interface Mod {
    default: SetStateAction<null>;
}

export default function (
    promise: Promise<Mod>,
    Loading: ReactElement
): ReactElement | null {
    const [component, setComponent] = useState(null);

    useEffect(() => {
        lazyLoad();
    }, []);

    async function lazyLoad() {
        const mod = await promise;
        setComponent(mod.default);
    }

    if (!component) {
        return Loading;
    }

    return component;
}
