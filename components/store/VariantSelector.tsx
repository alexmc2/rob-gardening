"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";

interface VariantSelectorProps {
  variants?: ProductVariant[];
  onVariantChange?: (variant: ProductVariant | null) => void;
}

type SelectedOptions = Record<string, string>;

const toOptionMap = (variant: ProductVariant | null | undefined): SelectedOptions => {
  if (!variant?.options) {
    return {};
  }

  return variant.options.reduce<SelectedOptions>((acc, option) => {
    if (option.name && option.value) {
      acc[option.name] = option.value;
    }
    return acc;
  }, {});
};

const variantMatches = (variant: ProductVariant, selections: SelectedOptions) => {
  if (!variant.options?.length) {
    return Object.keys(selections).length === 0;
  }

  return variant.options.every((option) => {
    if (!option.name || !option.value) {
      return true;
    }

    const selected = selections[option.name];
    return !selected || selected === option.value;
  });
};

const collectOptionValues = (variants: ProductVariant[]): Map<string, string[]> => {
  const map = new Map<string, string[]>();

  variants.forEach((variant) => {
    variant.options?.forEach((option) => {
      if (!option.name || !option.value) return;

      const values = map.get(option.name) ?? [];
      if (!values.includes(option.value)) {
        values.push(option.value);
      }
      map.set(option.name, values);
    });
  });

  return map;
};

export default function VariantSelector({
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const baseVariant = useMemo(() => variants?.[0] ?? null, [variants]);
  const optionValues = useMemo(() => (variants ? collectOptionValues(variants) : new Map()), [
    variants,
  ]);

  const selectedVariant = useMemo(() => {
    if (!variants?.length) {
      return null;
    }

    return (
      variants.find((variant) => variantMatches(variant, selectedOptions)) ?? variants[0]
    );
  }, [variants, selectedOptions]);

  useEffect(() => {
    if (!variants?.length) {
      setSelectedOptions({});
      onVariantChange?.(null);
      return;
    }

    if (Object.keys(selectedOptions).length === 0 && baseVariant) {
      const defaults = toOptionMap(baseVariant);
      setSelectedOptions(defaults);
      onVariantChange?.(baseVariant);
      return;
    }

    onVariantChange?.(selectedVariant ?? null);
  }, [variants, baseVariant, selectedOptions, selectedVariant, onVariantChange]);

  if (!variants?.length || optionValues.size === 0) {
    return null;
  }

  const handleSelect = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const isValueAvailable = (name: string, value: string) => {
    if (!variants?.length) {
      return false;
    }

    const nextSelections: SelectedOptions = {
      ...selectedOptions,
      [name]: value,
    };

    return variants.some((variant) => variantMatches(variant, nextSelections));
  };

  return (
    <div className="flex flex-col gap-5">
      {Array.from(optionValues.entries()).map(([name, values]) => (
        <div key={name} className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {name}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {values.map((value: string) => {
              const isSelected = selectedOptions[name] === value;
              const isAvailable = isValueAvailable(name, value);

              return (
                <Button
                  key={value}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => isAvailable && handleSelect(name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold",
                    !isSelected && "bg-background",
                    !isAvailable && "opacity-60"
                  )}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
