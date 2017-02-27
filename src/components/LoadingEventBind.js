import EventBus from './EventBus';

export default function(loadingRef) {
    if (!loadingRef) return;

    EventBus.$on('showLoading', (title) => {
        loadingRef.show(title);
    });

    EventBus.$on('hideLoading', () => {
        loadingRef.hide();
    });
}