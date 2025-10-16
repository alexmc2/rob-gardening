// components/blocks/split/split-cards-list.tsx
import { stegaClean } from "next-sanity";
import SplitCardsItem from "@/components/blocks/split/split-cards-item";
import { PAGE_QUERYResult, ColorVariant } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-cards-list" }
>;

interface SplitCardsListProps extends SplitCardsList {
  color?: ColorVariant;
}

export default function SplitCardsList({ color, list }: SplitCardsListProps) {
  const colorParent = stegaClean(color);

  return (
    <div className="flex flex-col justify-center gap-12">
      {list &&
        list.length > 0 &&
        list.map((item, index) => {
          const key = item?._key ?? index;
          const tagLine = item?.tagLine
            ? stegaClean(item.tagLine) ?? null
            : null;
          const title = item?.title
            ? stegaClean(item.title) ?? null
            : null;

          return (
            <SplitCardsItem
              key={key}
              color={colorParent}
              {...item}
              tagLine={tagLine}
              title={title}
            />
          );
        })}
    </div>
  );
}
