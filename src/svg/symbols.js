import React from 'react';

export class Arrow extends React.Component {
	render() {
		return (
			<svg viewBox="-1 -1 36 36" xmlns="http://www.w3.org/2000/svg" className={this.props.classProps}>
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
export class ArrowSmaller extends React.Component {
	render() {
		return (
			<svg viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg" className={this.props.classProps}>
				<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
					<g className="fill" transform="translate(-65.000000, -4052.000000)" fill="#29CB7E" fillRule="nonzero">
						<polygon points="65.132 4059.186 71.45 4052.868 73.348 4054.74 68.798 4059.264 73.296 4063.788 71.528 4065.556"></polygon>
					</g>
				</g>
			</svg>
		);
	}
}
