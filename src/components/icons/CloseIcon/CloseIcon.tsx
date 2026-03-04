import Icon from 'components/icons/Icon';
import { type IconProps } from 'components/icons/Icon';
import React from 'react';

const CloseIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = 'header',
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} color={color} {...props}>
            <path d="M20 20L4 4.00003M20 4L4.00002 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </Icon>
    );
};

export default CloseIcon;