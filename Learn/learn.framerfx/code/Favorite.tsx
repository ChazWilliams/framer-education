import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"
import { Link } from "./Link"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    value: boolean
    onValueChange: (value: boolean) => void
}

// A component for the favorite icon
export const Favorite = (props: Partial<Props>) => {
    const { value, onValueChange, ...rest } = props

    const [state, setState] = React.useState({
        value,
    })

    // Update state from props
    React.useEffect(() => {
        setState({
            ...state,
            value,
        })
    }, [value])

    // Toggle the favorite state
    const handleFavorite = event => {
        event.stopPropagation()
        setState({
            value: !state.value,
        })
        onValueChange(!state.value)
    }

    return (
        <Link
            width={50}
            height={50}
            {...rest}
            icon={state.value ? "favorite" : "favorite_border"}
            onTap={handleFavorite}
        />
    )
}

Favorite.defaultProps = {
    height: 50,
    width: 50,
    value: false,
    onValueChange: value => null,
}

addPropertyControls(Favorite, {
    value: {
        title: "Value",
        type: ControlType.Boolean,
        defaultValue: false,
    },
})
