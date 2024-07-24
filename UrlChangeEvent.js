class UrlChangeEvent extends CustomEvent {
    constructor() {
        super('urlchange', {
            detail: { new_url: getCurrentUrl() }
        })
    }
}