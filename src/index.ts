import './styles.scss';
import './app';

window.onerror = (event: Event | string, source?: string) => {
    console.log(event);
};