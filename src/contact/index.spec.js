import ac from 'argument-contracts';
import { Contact } from '.';

describe('Contact', () => {
    let options;

    beforeEach(() => {
        options = {
            email: 'all.your.base@arebelongtous.com',
            slack: '#someone-set-us-up-the-bomb',
            url: 'https://bad.techno.remixes.com'
        };

        spyOn(ac, 'assertString');
    });

    it('should assert email is a string', () => {
        new Contact(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.email, jasmine.stringMatching(/email/));
    });

    it('should assert slack is a string', () => {
        new Contact(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.slack, jasmine.stringMatching(/slack/));
    });

    it('should assert url is a string', () => {
        new Contact(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.url, jasmine.stringMatching(/url/));
    });

    it('should now throw if email is not provided', () => {
        delete options.email;

        expect(() => new Contact(options)).not.toThrow();
    });

    it('should now throw if slack is not provided', () => {
        delete options.slack;

        expect(() => new Contact(options)).not.toThrow();
    });

    it('should now throw if url is not provided', () => {
        delete options.url;

        expect(() => new Contact(options)).not.toThrow();
    });

    it('should throw if no contact information is provided', () => {
        expect(() => new Contact({})).toThrowError(/contact/);
    });

    it('should map properties', () => {
        const result = new Contact(options);

        expect(result.email).toEqual(options.email);
        expect(result.slack).toEqual(options.slack);
        expect(result.url).toEqual(options.url);
    });

    it('should be able to create copy from instance', () => {
        const resultOne = new Contact(options);
        const resultTwo = new Contact(options);

        expect(resultOne.email).toEqual(resultTwo.email);
        expect(resultOne.slack).toEqual(resultTwo.slack);
        expect(resultOne.url).toEqual(resultTwo.url);
    });

    it('should be immutable', () => {
        const result = new Contact(options);

        expect(() => { result.email = 'yay'; }).toThrow();
        expect(() => { result.slack = 'yay'; }).toThrow();
        expect(() => { result.url = 'yay'; }).toThrow();
    });
});