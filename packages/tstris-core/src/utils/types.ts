// Names of properties in T with types that include undefined
type OptionalPropertyNames<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];

// Common properties from L and R with undefined in R[K] replaced by type in L[K]
type SpreadProperties<L, R, K extends keyof L & keyof R> = {
	[P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = { [K in keyof T]: T[K] }; // see note at bottom*

/**
 * Type of { ...L, ...R }
 *
 * Thank you to kentcdodds for this type, only one I could find that works like js does
 * 
 * https://github.com/microsoft/TypeScript/issues/10727#issuecomment-725654378
 */
export type Spread<L, R> = Id<
	// Properties in L that don't exist in R
	Pick<L, Exclude<keyof L, keyof R>> &
		// Properties in R with types that exclude undefined
		Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
		// Properties in R, with types that include undefined, that don't exist in L
		Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
		// Properties in R, with types that include undefined, that exist in L
		SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;
