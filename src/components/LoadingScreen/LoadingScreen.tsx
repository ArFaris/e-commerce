import Loader from "components/Loader";
import Text from "components/Text";
import styles from './LoadingScreen.module.scss';
import { useEffect } from "react";

const LoadingScreen = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className={styles.loading}>
                <Loader />
                <Text view='subtitle'>Загрузка...</Text>
        </div>
    )
}

export default LoadingScreen;
