var vali = require('../vali');

describe('validate', function() {

    describe('email', function() {

        it('should validate Email', function() {
            expect(vali.email('foo.bar-5@qux.com')).toBeTruthy();
            expect(vali.email('foo+bar-5@qux.com')).toBeTruthy();
            expect(vali.email('foo&bar-5@qux.com')).toBeTruthy();
            expect(vali.email('foo...bar-5@qux.com')).toBeFalsy();
        });
    });

    describe('minAge', function() {

        it('should validate minimum age', function() {
            expect(vali.minAge((new Date(1996, 02, 20)), 18)).toBeTruthy();
            expect(vali.minAge((new Date(2002, 02, 20)), 18)).toBeFalsy();
        });

    });

    describe('name', function() {

        it('should validate name', function() {
            expect(vali.name('Foo')).toBeTruthy();
            expect(vali.name("Foo'o bar")).toBeTruthy();
            expect(vali.name('Foo*')).toBeFalsy();
            expect(vali.name('Foo1')).toBeFalsy();
        });

    });

    describe('username', function() {

        it('should validate username', function() {
            expect(vali.username('foobar')).toBeTruthy();
            expect(vali.username('foo_bar')).toBeTruthy();
            expect(vali.username('foo-bar')).toBeFalsy();
            expect(vali.username('foo.bar')).toBeFalsy();
        });

    });

    describe('zip', function() {

        it('should validate zip', function() {
            expect(vali.zip(12345)).toBeTruthy();
            expect(vali.zip('12345-2453')).toBeTruthy();
            expect(vali.zip(123456789)).toBeFalsy();
        });

    });

    describe('coordinate', function() {
        it('should validate coordinate', function() {
            expect(vali.coord(41.1029592)).toBeTruthy();
            expect(vali.coord(-104.8049363)).toBeTruthy();
            expect(vali.coord('13')).toBeFalsy();
            expect(vali.coord(-200.8049363)).toBeFalsy();
        });
    });

    describe('ssn', function() {
        it('should validate ssn', function() {
            expect(vali.ssn('000-11-1111')).toBeFalsy();
            expect(vali.ssn('457-55-5462')).toBeTruthy();
            expect(vali.ssn('457555462')).toBeTruthy();
        });
    });

    describe('validator', function() {
        it('should add validator', function() {
            vali.validator('alpha', function(str) {
              return /^[a-zA-Z]+$/.test(str);
            });

            expect(vali.alpha('abc')).toBeTruthy();
            expect(vali.alpha(3)).toBeFalsy();
            expect(vali.alpha('adf453')).toBeFalsy();
        });
    });
});
