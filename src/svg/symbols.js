import React from 'react';

export class Arrow extends React.Component {
	render() {
		return (
			<svg viewBox="-1 -1 36 36" xmlns="http://www.w3.org/2000/svg" className={this.props.className}>
				<g fill="none" fillRule="evenodd">
					<ellipse
							className="stroke"
						stroke="#FFF"
						strokeWidth="2"
						transform="matrix(1 0 0 -1 0 33.841)"
						cx="17"
						cy="16.921"
						rx="17"
						ry="16.921"
					/>
					<path

className="stroke"
						stroke="#FEFEFE"
						strokeWidth="3"
						transform="matrix(-1 0 0 1 34 0)"
						d="M14 10.841L20 17.341 14 23.841"
					/>
				</g>
			</svg>
		);
	}
}
