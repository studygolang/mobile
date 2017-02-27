import EventBus from './EventBus';

export default function(modalRef) {
    if (!modalRef) return;

    EventBus.$on('alert', (param = {}) => {
        modalRef.modalAlert(param);
    });

    EventBus.$on('confirm', (param = {}) => {
        modalRef.modalConfirm(param);
    });
}