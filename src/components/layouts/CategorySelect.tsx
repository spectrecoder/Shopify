import { Dispatch, SetStateAction } from "react"
import CreatableSelect from "react-select/creatable"
import { SingleValue } from "react-select"

const options = ["Chocolate", "Strawberry", "Vanilla"]

interface Props {
  setCategoryName: Dispatch<SetStateAction<string | undefined>>
}

interface Choice {
  label: string
  value: string
}

export default function CategorySelect({ setCategoryName }: Props) {
  return (
    <CreatableSelect
      // options={options}
      inputId="category"
      placeholder="Enter a category"
      isClearable
      openMenuOnFocus={true}
      onChange={(choice: SingleValue<Choice>) => setCategoryName(choice?.value)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#f8dcac",
          primary: "#F9A109",
        },
      })}
      styles={{
        placeholder: (baseStyles) => ({
          ...baseStyles,
          fontSize: "1.5rem",
          color: "#BDBDBD",
          fontWeight: "500",
        }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          border: `.2rem solid ${
            state.isFocused ? "#F9A109" : "#BDBDBD"
          } !important`,
          borderRadius: "1.2rem",
          height: "6rem",
          fontSize: "1.6rem",
          fontWeight: "500",
          color: "#34333A",
          boxShadow: "0",
          padding: "0 .8rem",
        }),
        option: (baseStyles, { isSelected }) => ({
          ...baseStyles,
          fontSize: "1.8rem",
          fontWeight: "600",
          color: isSelected ? "#34333A" : "#828282",
        }),
      }}
    />
  )
}
