/**
 * Иконки для карточек преимуществ на странице «Вакансии».
 * Нарисованы в той же манере, что и иконки преимуществ на главной:
 * бокс 75×50, линия оранжевого фирменного цвета.
 */

const COLOR = '#FF5722'

interface IconProps {
  className?: string
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      width="75"
      height="50"
      viewBox="0 0 75 50"
      fill="none"
      stroke={COLOR}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  )
}

/** Официальное оформление — документ с печатью */
export function VacancyContractIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path d="M14 4h24l10 10v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" />
      <path d="M38 4v10h10" />
      <path d="M18 22h16M18 30h10" />
      <circle cx="55" cy="34" r="9" />
      <path d="M51 34l3 3 6-6" />
    </Frame>
  )
}

/** Зарплата точно в срок — купюра с часами */
export function VacancySalaryIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="8" y="10" width="42" height="26" rx="4" />
      <circle cx="29" cy="23" r="6" />
      <path d="M16 17h.02M42 29h.02" />
      <circle cx="58" cy="34" r="10" />
      <path d="M58 29v5l3.5 2.5" />
    </Frame>
  )
}

/** Работа по понятным правилам — часы и список задач */
export function VacancyScheduleIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <circle cx="21" cy="25" r="16" />
      <path d="M21 15v10l7 4" />
      <path d="M45 14h22M45 25h22M45 36h14" />
    </Frame>
  )
}

/** Помогаем стать профессионалом — рост и наставничество */
export function VacancyGrowthIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <circle cx="19" cy="15" r="7" />
      <path d="M7 42c0-7 5.4-12 12-12s12 5 12 12" />
      <path d="M42 42V27M53 42V19M64 42V11" />
      <path d="M38 8l6-4 4 6" />
    </Frame>
  )
}
