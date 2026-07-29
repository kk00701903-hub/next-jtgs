type ClassValue = string | false | null | undefined

/**
 * 차세대 소스(atoms/molecules/organisms)가 사용하는 cn().
 * 조건부 클래스 합성 전용이며, tailwind-merge 같은 충돌 병합은 하지 않는다.
 */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ')
}
