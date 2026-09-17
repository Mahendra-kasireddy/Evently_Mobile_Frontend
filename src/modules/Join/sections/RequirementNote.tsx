import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { JOIN_COPY } from '../constants';
import { footnoteStyles } from '../styles';

/** Sets the expectation before the wizard asks for documents, not during it. */
export function RequirementNote() {
  return (
    <View style={footnoteStyles.card}>
      <EventlyIcon name="shield-check-outline" size={16} color={brand.green} />
      <EventlyText variant="caption" style={footnoteStyles.text}>
        {JOIN_COPY.footnote}
      </EventlyText>
    </View>
  );
}

export default RequirementNote;
