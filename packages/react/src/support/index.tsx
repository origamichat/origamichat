"use client";

import "./styles.css";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import * as Primitive from "../primitive";
import { SupportProvider } from "../provider";
import Icon from "./components/icons";
import { cn } from "./utils";

export const Support = () => {
	const [value, setValue] = React.useState("");

	const handleSubmit = () => {
		// TODO: integrate with backend
		setValue("");
	};

	return (
		<div className="co-support co-relative">
			<Primitive.Bubble className="co-bubble">
				{({ isOpen, unreadCount, toggle }) => (
					<>
						<AnimatePresence mode="wait">
							{isOpen ? (
								<motion.div
									animate={{
										scale: 1,
										rotate: 0,
										opacity: 1,
										transition: { duration: 0.2, ease: "easeOut" },
									}}
									className="co-flex co-items-center co-justify-center"
									exit={{
										scale: 0.9,
										rotate: -45,
										opacity: 0,
										transition: { duration: 0.1, ease: "easeIn" },
									}}
									initial={{ scale: 0.9, rotate: 45, opacity: 0 }}
									key="chevron"
								>
									<Icon className="co-icon-lg" name="chevron-down" />
								</motion.div>
							) : (
								<motion.div
									animate={{
										scale: 1,
										rotate: 0,
										opacity: 1,
										transition: { duration: 0.2, ease: "easeOut" },
									}}
									className="co-flex co-items-center co-justify-center"
									exit={{
										scale: 0.9,
										rotate: 45,
										opacity: 0,
										transition: { duration: 0.1, ease: "easeIn" },
									}}
									initial={{ scale: 0.9, rotate: -45, opacity: 0 }}
									key="chat"
								>
									<Icon className="co-icon-xl" name="chat" variant="filled" />
								</motion.div>
							)}
						</AnimatePresence>
						{unreadCount > 0 && (
							<motion.span
								animate={{ scale: 1, opacity: 1 }}
								className="co-unread-badge"
								exit={{ scale: 0, opacity: 0 }}
								initial={{ scale: 0, opacity: 0 }}
							>
								{unreadCount}
							</motion.span>
						)}
					</>
				)}
			</Primitive.Bubble>
			<Primitive.Window className="co-window">
				<div className="co-header">
					<p className="co-header-title">Support</p>
				</div>
				<div className="co-content">{/* messages go here */}</div>
				<div className="co-input-container">
					<div className="co-input-wrapper">
						<Primitive.Input
							className="co-input"
							onChange={setValue}
							onSubmit={handleSubmit}
							value={value}
						/>
						<Primitive.SendButton
							className="co-send-button"
							onClick={handleSubmit}
						>
							<Icon className="co-icon" filledOnHover name="send" />
						</Primitive.SendButton>
					</div>
					<p className="co-footer">
						We run on{" "}
						<a
							className="co-footer-link"
							href="https://cossistant.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							Cossistant
						</a>
					</p>
				</div>
			</Primitive.Window>
		</div>
	);
};

export default Support;
