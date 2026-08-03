/**
 * Reusable question-type input components.
 *
 * Each component follows the shared `QuestionInputProps<T>` shape (see ./types).
 * The aliases on the left are the canonical, domain-friendly names used by the
 * QuestionRenderer (`../QuestionRenderer`): map a `question_type` to a component.
 *
 * Do not build answer-handling logic here — these are pure UI inputs.
 */

import SingleChoice from './SingleChoice'
import MultipleChoice from './MultipleChoice'
import YesNo from './YesNo'
import DropdownInput from './DropdownInput'
import SliderInput from './SliderInput'
import DateInput from './DateInput'
import TimeInput from './TimeInput'
import NumericInput from './NumericInput'
import DecimalInput from './DecimalInput'
import FreeTextInput from './FreeTextInput'
import MultiSelectInput from './MultiSelectInput'
import SearchInput from './SearchInput'
import FileUploadInput from './FileUploadInput'

export type { QuestionInputProps, QuestionInputComponent } from './types'

// Single-select / radio
export const RadioInput = SingleChoice
// Multi-select / checkbox
export const CheckboxInput = MultipleChoice
// Yes / No toggle
export const YesNoInput = YesNo
// Dropdown selector
export const Dropdown = DropdownInput
// Range slider
export const Slider = SliderInput
// Date picker
export const DatePicker = DateInput
// Time picker
export const TimePicker = TimeInput
// Numeric input
export const NumberInput = NumericInput
// Decimal / float input
export const DecimalInput = DecimalInput
// Text area
export const TextArea = FreeTextInput
// Multi-select chips
export const MultiSelect = MultiSelectInput
// Search / lookup
export const Search = SearchInput
// File upload
export const FileUpload = FileUploadInput

// Also re-export the originals for consumers that prefer explicit names.
export {
  SingleChoice,
  MultipleChoice,
  YesNo,
  DropdownInput,
  SliderInput,
  DateInput,
  TimeInput,
  NumericInput,
  DecimalInput,
  FreeTextInput,
  MultiSelectInput,
  SearchInput,
  FileUploadInput,
}
