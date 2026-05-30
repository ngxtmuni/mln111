declare module "react-responsive-masonry" {
  import type { ComponentType, PropsWithChildren } from "react"

  export interface MasonryProps extends PropsWithChildren {
    columnsCount?: number
    gutter?: string
    className?: string
  }

  export interface ResponsiveMasonryProps extends PropsWithChildren {
    columnsCountBreakPoints?: Record<number, number>
    gutterBreakPoints?: Record<number, string>
    className?: string
  }

  const Masonry: ComponentType<MasonryProps>
  export const ResponsiveMasonry: ComponentType<ResponsiveMasonryProps>

  export default Masonry
}
