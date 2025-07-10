import { cryptoPretty } from '../index.js'

const testValues = [
    0,
    0.0001,
    0.0000001234,
    0.9999,
    0.2323,
    0.0000000005678,
    0.123456789,
    0.0000456,
    0.9999999,
    -0.0001,
    -0.1234,
    -0.0000009876,
    -0.987654321,
    -0.0000456,
    -1.2345e-7,
    1e-10,
    1e-15,
];

testValues.forEach((value) => {
    const result = cryptoPretty(value);
    console.log(`Input: ${value}`);
    console.log(`Short Variant: ${result.shortVariant()}`);
    console.log('\n');
});