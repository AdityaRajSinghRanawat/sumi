import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMockContact } from './propertyContact.js';

test('buildMockContact returns deterministic contact details for a property', () => {
  const property = { id: 'seed-1', name: 'Minato Skyline Residence' };
  const contact = buildMockContact(property);

  assert.ok(contact.agentName && contact.agentName.length > 0);
  assert.match(contact.phone, /^\+81 /);
  assert.ok(contact.email.includes('@sumi-realty.jp'));
  assert.ok(contact.officeLocation && contact.officeLocation.length > 0);
  assert.ok(contact.company && contact.company.length > 0);
});
