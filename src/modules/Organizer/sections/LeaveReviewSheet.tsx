import { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { LEAVE_REVIEW_COPY as COPY, ORG_STAR, ORG_TRACK, STAR_LABEL } from '../constants';
import { usePostReview, useReviewTags } from '../hooks';
import { leaveReviewStyles as s } from '../styles';

interface LeaveReviewSheetProps {
  visible: boolean;
  /** The completed booking being reviewed — the only id the client sends. */
  bookingId: string;
  onClose: () => void;
  /** Called once the review is stored, so the caller can hide its prompt. */
  onPosted: () => void;
}

/**
 * Leaving a review, after an event has been delivered.
 *
 * Without this the review collection would stay empty forever, and every
 * rating in the app would remain a number nobody could account for.
 *
 * The rating is required and the rest is not: a customer who wants to give
 * five stars and leave should be able to, and a form that demands a paragraph
 * is a form that collects nothing. The tags come from the server so this
 * screen never hardcodes a vocabulary the counts are computed against.
 */
export function LeaveReviewSheet({ visible, bookingId, onClose, onPosted }: LeaveReviewSheetProps) {
  const tags = useReviewTags();
  const post = usePostReview();
  const [rating, setRating] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);

  const toggleTag = (key: string) =>
    setPicked((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    );

  const submit = () => {
    setTouched(true);
    if (rating < 1) return;
    post
      .execute(bookingId, { rating, comment: comment.trim(), tags: picked })
      .then(() => onPosted())
      // The error shows under the button; nothing was stored, so the sheet
      // stays open with what the customer wrote still in it.
      .catch(() => {});
  };

  const missingRating = touched && rating < 1;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={s.grabber} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventlyText variant="h1" style={s.title}>
              {COPY.title}
            </EventlyText>
            <EventlyText variant="caption" style={s.subtitle}>
              {COPY.subtitle}
            </EventlyText>

            <EventlyText variant="caption" style={s.groupLabel}>
              {COPY.ratingLabel}
            </EventlyText>
            <View style={s.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={s.starButton}
                  onPress={() => setRating(n)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: rating === n }}
                  accessibilityLabel={`${n} ${n === 1 ? 'star' : 'stars'}, ${STAR_LABEL[n]}`}
                >
                  <EventlyIcon name="star" size={34} color={n <= rating ? ORG_STAR : ORG_TRACK} />
                </TouchableOpacity>
              ))}
              {/* The word, so a rating is never just a count of shapes. */}
              {rating > 0 ? (
                <EventlyText variant="body" style={s.starWord}>
                  {STAR_LABEL[rating]}
                </EventlyText>
              ) : null}
            </View>

            {tags.data && tags.data.length > 0 ? (
              <>
                <EventlyText variant="caption" style={s.groupLabel}>
                  {COPY.tagsLabel}
                </EventlyText>
                <View style={s.chips}>
                  {tags.data.map((tag) => {
                    const on = picked.includes(tag.key);
                    return (
                      <TouchableOpacity
                        key={tag.key}
                        style={[s.chip, on && s.chipOn]}
                        activeOpacity={0.8}
                        onPress={() => toggleTag(tag.key)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: on }}
                        accessibilityLabel={tag.label}
                      >
                        <EventlyText variant="caption" style={[s.chipText, on && s.chipTextOn]}>
                          {tag.label}
                        </EventlyText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}

            <EventlyText variant="caption" style={s.groupLabel}>
              {COPY.commentLabel}
            </EventlyText>
            <TextInput
              style={s.input}
              value={comment}
              onChangeText={setComment}
              placeholder={COPY.commentPlaceholder}
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={1000}
              accessibilityLabel={COPY.commentLabel}
            />

            {/* Said before posting, not after — a review cannot be edited. */}
            <EventlyText variant="caption" style={s.permanence}>
              {COPY.permanenceNote}
            </EventlyText>

            <TouchableOpacity
              style={[s.submit, (post.loading || rating < 1) && s.submitDisabled]}
              activeOpacity={0.85}
              disabled={post.loading}
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel={COPY.submit}
            >
              <EventlyText variant="subtitle" style={s.submitText}>
                {post.loading ? COPY.submitting : COPY.submit}
              </EventlyText>
            </TouchableOpacity>

            {missingRating ? (
              <EventlyText variant="caption" style={s.error}>
                {COPY.needRating}
              </EventlyText>
            ) : null}
            {post.error ? (
              <EventlyText variant="caption" style={s.error}>
                {COPY.failed}
              </EventlyText>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default LeaveReviewSheet;
