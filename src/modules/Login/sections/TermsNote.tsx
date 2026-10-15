import { AppText } from '../../../Components';
import { TERMS_COPY } from '../constants';
import { termsStyles } from '../styles';

/**
 * The consent line under the CTA.
 *
 * "Terms" and "Privacy Policy" are emphasised but not tappable, because
 * neither document is published yet — LegalSupport lists both as `pending` for
 * the same reason. A link that opens nothing is worse than plain text on a
 * consent notice, so when the URLs exist, give each span an `onPress` that
 * opens it and nothing else here has to change.
 */
export function TermsNote() {
  return (
    <AppText variant="caption" style={termsStyles.text}>
      {TERMS_COPY.lead}{' '}
      <AppText variant="caption" style={termsStyles.link}>
        {TERMS_COPY.terms}
      </AppText>{' '}
      {TERMS_COPY.conjunction}{' '}
      <AppText variant="caption" style={termsStyles.link}>
        {TERMS_COPY.privacy}
      </AppText>
      .
    </AppText>
  );
}

export default TermsNote;
