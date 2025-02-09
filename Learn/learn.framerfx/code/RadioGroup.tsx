import * as React from "react"
import { addPropertyControls, ControlType, Stack, FrameProps } from "framer"
import { RowItem } from "./RowItem"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    options: string[]
    value: string
    disabled: boolean
    required: boolean
    onValueChange: (value: string, index: number, valid: boolean) => void
    validation: (value: string, index: number) => boolean
}

/**
 * Segment
 * @param props
 */
export function RadioGroup(props: Partial<Props>) {
    // Grab the properties we want to use from props (note that we're
    // renaming the value and selectedIndex, to avoid conflicting with the
    // state's `value` and `selectedIndex` properties.
    const {
        value: initial,
        options,
        disabled,
        validation,
        onValueChange,
        height,
        width,
        required,
    } = props

    /* ---------------------------------- State --------------------------------- */

    // Set the initial value
    const initialSelectedIndex =
        typeof initial === "number" ? initial : options.indexOf(initial)

    const initialValue =
        typeof initial === "number" ? options[initialSelectedIndex] : initial

    // Get a valid state for the current value
    const validate = (value, index) =>
        index && index >= 0
            ? validation(value || initialValue, index || initialSelectedIndex)
            : !required

    // Initialize state with props values
    const [state, setState] = React.useState({
        value: initialValue,
        selectedIndex: initialSelectedIndex,
        valid: validate(initialValue, initialSelectedIndex),
    })

    // When the hook receives new props values, overwrite the state
    React.useEffect(() => {
        const selectedValue = initialValue

        setState({
            ...state,
            value: selectedValue || null,
            selectedIndex: options.indexOf(selectedValue),
            valid: validate(state.value, state.selectedIndex),
        })
    }, [initialValue, validation, options])

    // Re-validate when required or validation changes
    React.useEffect(() => {
        setState({
            ...state,
            valid: validate(state.value, state.selectedIndex),
        })
    }, [required, validation])

    /* ----------------------------- Event Handlers ----------------------------- */

    // When the user selects an option, updatet state and run onValueChange
    const setSelectedIndex = (selectedIndex: number) => {
        if (disabled) return

        const selectedValue = options[selectedIndex]

        const value = selectedValue || null

        const valid = validation(value, selectedIndex)

        onValueChange(value, selectedIndex, valid)

        setState({
            ...state,
            value,
            valid,
            selectedIndex,
        })
    }

    // Get the properties we want from state
    const { value, selectedIndex, valid } = state

    return (
        <Stack
            height={options.length * 50}
            width={width}
            direction="vertical"
            alignment="center"
            gap={1}
            borderRadius={12}
            overflow="hidden"
            border={`1px solid ${valid ? colors.Border : colors.Warn}`}
            background={disabled ? colors.Light : colors.Border}
        >
            {options.map((option, index) => {
                // An option is selected if its index matches the state's selectedIndex
                return (
                    <RowItem
                        key={`${props.id}_option_${index}`}
                        width="100%"
                        height={49}
                        text={option}
                        component="radio"
                        disabled={disabled}
                        value={index === selectedIndex}
                        validation={() => valid}
                        background={colors.Light}
                        paddingLeft={16}
                        onTap={() => !disabled && setSelectedIndex(index)}
                    />
                )
            })}
        </Stack>
    )
}

// Set the component's default properties
RadioGroup.defaultProps = {
    value: null,
    options: [],
    height: 200,
    width: 320,
    disabled: false,
    required: false,
    onValueChange: () => null,
    validation: () => true,
}

// Set the component's property controls
addPropertyControls(RadioGroup, {
    value: {
        type: ControlType.String,
        defaultValue: "Paris",
        title: "Value",
    },
    options: {
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.String,
        },
        defaultValue: ["Paris", "New York", "London", "Hong Kong"],
        title: "Options",
    },
    required: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Required",
    },
    disabled: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Disabled",
    },
})
