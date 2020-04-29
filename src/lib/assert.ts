import { AssertError } from "@/errors";

// Builtin NonNullable<T> cannnot exclude void type
type NonOptional<T> = T extends void | undefined | null ? never : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertError(msg);
  }
}

export function assertIsDefined<T>(val: T): asserts val is NonOptional<T> {
  if (val === undefined || val === null) {
    throw new AssertError(`Expected 'val' to be defined, but received ${val}`);
  }
}
