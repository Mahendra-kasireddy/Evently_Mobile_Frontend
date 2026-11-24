import {
  accountsMatch,
  buildPatch,
  canEditStep,
  changedFields,
  digitsOnly,
  firstErrorPart,
  formFrom,
  formatTimeInput,
  isStepDirty,
  isStepId,
  isValidAadhaar,
  isValidAccountNumber,
  isValidGst,
  isValidIfsc,
  isValidPan,
  isValidUpi,
  mapHub,
  maskMiddle,
  maskTail,
  mergeOptions,
  summaryRows,
  toFileModel,
  upperAlnum,
  validateStep,
} from '../src/organizerModules/GoLiveSetup/utils';
import type {
  OnboardingStatusDTO,
  SetupProfileDTO,
} from '../src/organizerModules/GoLiveSetup/types';

const file = (key: string) => ({
  url: `/api/upload/file/${key}.jpg`,
  key,
  originalName: `${key}.jpg`,
});

const profile = (over: Partial<SetupProfileDTO> = {}): SetupProfileDTO => ({
  id: 'p1',
  onboardingStatus: 'in_progress',
  canEdit: true,
  canEditBank: true,
  payoutReady: false,
  reviewNote: '',
  mobile: '+919999999999',
  firstName: 'Mahendra',
  lastName: 'K',
  contactEmail: 'm@example.com',
  businessName: 'Sri Lakshmi Events',
  displayName: '',
  businessType: 'company',
  primaryCategory: 'wedding_planner',
  city: 'Hyderabad',
  profilePhoto: null,
  aadhaarNumber: '234567890123',
  panNumber: 'ABCDE1234F',
  gstNumber: '',
  businessRegNumber: '',
  governmentIdType: 'aadhaar',
  governmentIdFile: null,
  panFile: null,
  gstFile: null,
  businessRegFile: null,
  accountHolderName: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  ifsc: '',
  upiId: '',
  cancelledChequeFile: null,
  experience: '',
  teamSize: '',
  languages: ['te', 'en'],
  secondaryCategories: [],
  servicesOffered: [],
  occasions: [],
  serviceRadius: 0,
  travelOption: '',
  paymentMethods: [],
  workingDays: [],
  workingHoursStart: '',
  workingHoursEnd: '',
  minBudget: 50000,
  maxBudget: 0,
  advancePercentage: 0,
  emergencyAvailability: false,
  destinationEvents: false,
  internationalEvents: false,
  tagline: '',
  businessDescription: 'We plan weddings.',
  yearsOfExperience: 0,
  instagram: '',
  facebook: '',
  youtube: '',
  website: '',
  linkedin: '',
  coverPhoto: null,
  gallery: [file('a'), file('b')],
  ...over,
});

const step = (
  id: string,
  complete: boolean,
  missingFields: string[] = [],
  requiredForGoLive = id !== 'bank',
) => ({ id, title: id, complete, missingFields, requiredForGoLive });

const status = (
  over: Partial<OnboardingStatusDTO> = {},
): OnboardingStatusDTO => ({
  onboardingStatus: 'in_progress',
  canEdit: true,
  canEditBank: true,
  canSubmit: false,
  goLiveMissing: [],
  payoutReady: false,
  reviewNote: '',
  submittedAt: null,
  steps: [
    step('basic', true),
    step('services', false, ['Experience', 'Team size', 'Languages']),
    step('portfolio', true),
    step('verification', false, ['PAN upload']),
    step('bank', false, [
      'Account holder name',
      'Bank name',
      'Account number',
      'IFSC',
      'Cancelled cheque',
    ]),
  ],
  ...over,
});

describe('identifier formats (mirroring the backend DTOs)', () => {
  it('PAN: five letters, four digits, a letter', () => {
    expect(isValidPan('ABCDE1234F')).toBe(true);
    expect(isValidPan('abcde1234f')).toBe(false);
    expect(isValidPan('ABCD1234F')).toBe(false);
    expect(isValidPan('ABCDE12345')).toBe(false);
  });

  it('Aadhaar: twelve digits, not starting 0 or 1', () => {
    expect(isValidAadhaar('234567890123')).toBe(true);
    expect(isValidAadhaar('123456789012')).toBe(false);
    expect(isValidAadhaar('23456789012')).toBe(false);
    expect(isValidAadhaar('2345 6789 0123')).toBe(false);
  });

  it('GSTIN: 15 characters with a Z in 14th place', () => {
    expect(isValidGst('22AAAAA0000A1Z5')).toBe(true);
    expect(isValidGst('22AAAAA0000A1Y5')).toBe(false);
    expect(isValidGst('22AAAAA0000A0Z5')).toBe(false);
    expect(isValidGst('22AAAAA0000A1Z')).toBe(false);
  });

  it('IFSC: four letters, a zero, six characters', () => {
    expect(isValidIfsc('HDFC0001234')).toBe(true);
    expect(isValidIfsc('SBIN0ABC123')).toBe(true);
    expect(isValidIfsc('HDFC1001234')).toBe(false);
    expect(isValidIfsc('hdfc0001234')).toBe(false);
  });

  it('account number: 6–20 digits; UPI: name@bank', () => {
    expect(isValidAccountNumber('123456')).toBe(true);
    expect(isValidAccountNumber('12345')).toBe(false);
    expect(isValidAccountNumber('1'.repeat(21))).toBe(false);
    expect(isValidUpi('name.k@okhdfc')).toBe(true);
    expect(isValidUpi('name@1bank')).toBe(false);
  });

  it('confirm account number must match exactly', () => {
    expect(accountsMatch('12345678', '12345678')).toBe(true);
    expect(accountsMatch('12345678', '12345679')).toBe(false);
    expect(accountsMatch('', '')).toBe(false);
  });
});

describe('input normalisers and masks', () => {
  it('uppercases PAN/GST/IFSC and keeps only letters and digits', () => {
    expect(upperAlnum('abc de-1234f', 10)).toBe('ABCDE1234F');
    expect(upperAlnum('hdfc0001234xyz', 11)).toBe('HDFC0001234');
  });

  it('keeps digits only for Aadhaar and account numbers', () => {
    expect(digitsOnly('2345 6789-0123', 12)).toBe('234567890123');
    expect(digitsOnly('12ab34', 20)).toBe('1234');
  });

  it('formats a time as HH:MM while typing', () => {
    expect(formatTimeInput('09')).toBe('09');
    expect(formatTimeInput('093')).toBe('09:3');
    expect(formatTimeInput('0930')).toBe('09:30');
    expect(formatTimeInput('09:305')).toBe('09:30');
  });

  it('masks saved sensitive numbers', () => {
    expect(maskTail('234567890123')).toBe('•••• •••• 0123');
    expect(maskTail('12345678')).toBe('•••• 5678');
    expect(maskTail('')).toBe('');
    expect(maskMiddle('ABCDE1234F')).toBe('AB••••••4F');
  });
});

describe('the hub', () => {
  it('counts the four go-live steps and lists bank details as optional', () => {
    const hub = mapHub(status());
    expect(hub).toMatchObject({
      phase: 'setup',
      done: 2,
      total: 4,
      percent: 50,
      canSubmit: false,
      showSubmit: true,
    });
    expect(hub.steps.map(s => s.id)).toEqual([
      'basic',
      'services',
      'portfolio',
      'verification',
      'bank',
    ]);
    expect(hub.steps[0]).toMatchObject({ done: true, line: 'Done' });
    expect(hub.steps[3].line).toBe('Add PAN upload');
    expect(hub.steps[1].line).toBe('Add experience, team size +1 more');
    expect(hub.steps[4]).toMatchObject({
      optional: true,
      line: 'Needed before your first payout',
    });
  });

  it('shows what bank details still miss once some are filled', () => {
    const hub = mapHub(
      status({
        steps: [step('bank', false, ['IFSC', 'Cancelled cheque'], false)],
      }),
    );
    expect(hub.steps[0].line).toBe('Add IFSC and cancelled cheque');
  });

  it('maps lifecycle states to phases and edit rights', () => {
    expect(
      mapHub(status({ onboardingStatus: 'changes_requested' })),
    ).toMatchObject({
      phase: 'changes',
      showSubmit: true,
    });
    const submitted = mapHub(
      status({
        onboardingStatus: 'submitted',
        canEdit: false,
        canEditBank: true,
      }),
    );
    expect(submitted).toMatchObject({ phase: 'submitted', showSubmit: false });
    expect(submitted.steps.find(s => s.id === 'basic')?.editable).toBe(false);
    expect(submitted.steps.find(s => s.id === 'bank')?.editable).toBe(true);
    expect(mapHub(status({ onboardingStatus: 'approved' })).phase).toBe(
      'approved',
    );
    expect(mapHub(status({ onboardingStatus: 'pending_review' })).phase).toBe(
      'pending',
    );
  });

  it('ignores steps it does not know and accepts only known step params', () => {
    const hub = mapHub(
      status({ steps: [step('basic', true), step('mystery', false)] }),
    );
    expect(hub.steps.map(s => s.id)).toEqual(['basic']);
    expect(isStepId('bank')).toBe(true);
    expect(isStepId('nope')).toBe(false);
    expect(isStepId(undefined)).toBe(false);
  });

  it('bank details have their own edit gate', () => {
    const gate = { canEdit: false, canEditBank: true };
    expect(canEditStep('bank', gate)).toBe(true);
    expect(canEditStep('verification', gate)).toBe(false);
  });
});

describe('changed fields and the PATCH body', () => {
  it('reads numbers ≤ 0 as not set and seeds the account confirmation', () => {
    const form = formFrom(profile({ accountNumber: '12345678' }));
    expect(form.minBudget).toBe('50000');
    expect(form.maxBudget).toBe('');
    expect(form.confirmAccountNumber).toBe('12345678');
  });

  it('nothing changed → not dirty, empty body', () => {
    const before = formFrom(profile());
    expect(isStepDirty('basic', before, { ...before })).toBe(false);
    expect(buildPatch('basic', before, { ...before })).toEqual({});
  });

  it('ignores outer spaces and multi-select order', () => {
    const before = formFrom(profile());
    const after = {
      ...before,
      businessName: ' Sri Lakshmi Events ',
      languages: ['en', 'te'],
    };
    expect(changedFields('basic', before, after)).toEqual([]);
    expect(changedFields('services', before, after)).toEqual([]);
  });

  it('sends only the changed fields of the step, trimmed and typed', () => {
    const before = formFrom(profile());
    const after = {
      ...before,
      experience: '5_10',
      maxBudget: '200000',
      minBudget: '',
      destinationEvents: true,
      languages: ['te'],
      // A basic-info change must never ride along on a services save.
      businessName: 'New name',
    };
    expect(buildPatch('services', before, after)).toEqual({
      experience: '5_10',
      maxBudget: 200000,
      minBudget: 0,
      destinationEvents: true,
      languages: ['te'],
    });
  });

  it('leaves out cleared fields the backend refuses empty; clears removed files', () => {
    const before = formFrom(
      profile({ gstNumber: '22AAAAA0000A1Z5', panFile: file('pan') }),
    );
    const after = {
      ...before,
      gstNumber: '',
      panFile: null,
      businessRegNumber: ' R1 ',
    };
    expect(buildPatch('verification', before, after)).toEqual({
      panFile: null,
      businessRegNumber: 'R1',
    });
  });

  it('tracks gallery additions, removals and order by file key', () => {
    const before = formFrom(profile());
    expect(
      changedFields('portfolio', before, { ...before, gallery: [file('a')] }),
    ).toEqual(['gallery']);
    expect(
      changedFields('portfolio', before, {
        ...before,
        gallery: [file('b'), file('a')],
      }),
    ).toEqual(['gallery']);
    expect(
      changedFields('portfolio', before, {
        ...before,
        gallery: [file('a'), file('b')],
      }),
    ).toEqual([]);
  });

  it('never sends the client-only account confirmation', () => {
    const before = formFrom(profile());
    const after = {
      ...before,
      accountNumber: '12345678',
      confirmAccountNumber: '12345678',
    };
    expect(buildPatch('bank', before, after)).toEqual({
      accountNumber: '12345678',
    });
  });
});

describe('step validation', () => {
  const base = formFrom(profile());

  it('flags bad formats and jumps to the tab they are on', () => {
    const errors = validateStep(
      'verification',
      { ...base, aadhaarNumber: '123', panNumber: 'ABC', gstNumber: '' },
      base,
    );
    expect(Object.keys(errors).sort()).toEqual(['aadhaarNumber', 'panNumber']);
    expect(firstErrorPart('verification', errors)).toBe(0);
    expect(firstErrorPart('verification', {})).toBeNull();
  });

  it('requires a new account number to be confirmed', () => {
    const changed = {
      ...base,
      accountNumber: '12345678',
      confirmAccountNumber: '1234567',
    };
    expect(validateStep('bank', changed, base).confirmAccountNumber).toBe(
      'Account numbers do not match',
    );
    expect(
      validateStep(
        'bank',
        { ...changed, confirmAccountNumber: '12345678' },
        base,
      ),
    ).toEqual({});
    expect(
      validateStep('bank', { ...base, ifsc: 'HDFC1234' }, base).ifsc,
    ).toBeDefined();
  });

  it('checks times, ranges and budget order on services', () => {
    const errors = validateStep(
      'services',
      {
        ...base,
        workingHoursStart: '25:00',
        advancePercentage: '120',
        minBudget: '50000',
        maxBudget: '10000',
      },
      base,
    );
    expect(Object.keys(errors).sort()).toEqual([
      'advancePercentage',
      'maxBudget',
      'workingHoursStart',
    ]);
    expect(firstErrorPart('services', errors)).toBe(1);
  });

  it('accepts an empty step — the hub lists what is missing', () => {
    expect(validateStep('basic', { ...base, contactEmail: '' }, base)).toEqual(
      {},
    );
    expect(
      validateStep('basic', { ...base, contactEmail: 'bad' }, base)
        .contactEmail,
    ).toBe('Enter a valid email');
  });
});

describe('files and the read-only summary', () => {
  it('absolutises stored files into a uri and names them', () => {
    const model = toFileModel(file('cover'));
    expect(model.uri).toMatch(/^https?:\/\/.+\/api\/upload\/file\/cover\.jpg$/);
    expect(model).toMatchObject({
      key: 'cover',
      name: 'cover.jpg',
      isImage: true,
    });
    expect(
      toFileModel({
        url: '/api/upload/file/id.pdf',
        key: 'd',
        originalName: '',
      }),
    ).toMatchObject({ name: 'id.pdf', isImage: false });
  });

  it('masks Aadhaar and PAN and labels options', () => {
    const options = mergeOptions(null, {
      experienceRanges: [],
      teamSizes: [],
      languages: [],
      travelOptions: [],
      paymentMethods: [],
      workingDays: [],
      documentTypes: [{ key: 'aadhaar', label: 'Aadhaar card' }],
      categories: [],
      occasions: [],
      serviceCategories: [],
    });
    const rows = summaryRows('verification', formFrom(profile()), options);
    const value = (key: string) => rows.find(r => r.key === key)?.value;
    expect(value('aadhaarNumber')).toBe('•••• •••• 0123');
    expect(value('panNumber')).toBe('AB••••••4F');
    expect(value('governmentIdType')).toBe('Aadhaar card');
    expect(value('gstNumber')).toBe('Not added');
  });
});
