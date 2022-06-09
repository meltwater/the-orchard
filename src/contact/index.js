import ac from 'argument-contracts';

/**
 * Contact information for the maintainers of an orchard entry
 *
 * Each constructor parameter is individually options, but at least one must
 * be provided.
 *
 * @param {string} email - Email address
 * @param {string} slack - Slack channel name
 * @param {string} url - URL to associate with a particular orchard entry
 *
 * @property {string} email - Email address
 * @property {string} slack - Slack channel name
 * @property {string} url - URL to associate with a particular orchard entry
 */
export class Contact {
    constructor({ email, slack, url }) {
        if(email) {
            ac.assertString(email, 'email');
        }

        if(slack) {
            ac.assertString(slack, 'slack');
        }

        if(url) {
            ac.assertString(url, 'url');
        }

        if(!email && !slack && !url) {
            throw new Error('contact requires one of email, slack, or url to be provided.');
        }

        this.email = email;
        this.slack = slack;
        this.url = url;

        Object.freeze(this);
    }
}
