
import React from 'react';
import styled from 'styled-components';
import {FaFacebook, FaInstagram, FaPinterest, FaTiktok, FaTwitter, FaYoutube} from "react-icons/fa";

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 80px;

    &::-webkit-scrollbar {
        width: 10px;
        position: absolute;
        right: -10px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    scrollbar-width: thin;
    scrollbar-color: #888 transparent;
`;

const ContactPageContainer = styled.div`
    min-height: 100vh;
    background-color: #EEEEEE;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    @media (max-width: 768px) {
        padding: 1rem;
        align-items: stretch;
    }
`;

const ContactCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 32px;
    padding: 0;
    width: 100%;
    max-width: 1000px;
    box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 140, 66, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
    position: relative;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #ff8c42, #e67e22, #d35400, #e67e22, #ff8c42);
        background-size: 300% 100%;
        animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
        0%, 100% { background-position: 0 50%; }
        50% { background-position: 100% 50%; }
    }

    @media (max-width: 768px) {
        max-width: 500px;
        margin: 1rem;
    }
`;

const ContactHeader = styled.div`
    text-align: center;
    padding: 3rem 3rem 2rem;
    background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
    color: white;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="20" r="1.5" fill="rgba(255,255,255,0.08)"/><circle cx="80" cy="30" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="20" cy="50" r="1" fill="rgba(255,255,255,0.06)"/><circle cx="70" cy="60" r="2" fill="rgba(255,255,255,0.08)"/><circle cx="30" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="90" r="1" fill="rgba(255,255,255,0.05)"/></svg>') repeat;
        animation: sparkle 15s linear infinite;
        pointer-events: none;
    }

    @keyframes sparkle {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-100px, -100px); }
    }
`;

const ContactTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const ContactSubtitle = styled.p`
    font-size: 1.25rem;
    opacity: 0.95;
    line-height: 1.6;
    position: relative;
    z-index: 1;
    font-weight: 400;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const ContactContent = styled.div`
    padding: 3rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    align-items: start;

    @media (max-width: 768px) {
        padding: 2rem;
        grid-template-columns: 1fr;
    }
`;

const ContactSection = styled.div`
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff8c42, #e67e22);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::before {
        opacity: 1;
    }
`;

const SectionTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const SectionIcon = styled.div`
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
`;

const ContactItem = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 248, 243, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(255, 140, 66, 0.1);
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 248, 243, 0.8);
        border-color: rgba(255, 140, 66, 0.2);
        transform: translateX(4px);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const ItemIcon = styled.div`
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #fff8f3 0%, #fef3e2 100%);
    border: 2px solid rgba(255, 140, 66, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-size: 1.2rem;
    flex-shrink: 0;
    transition: all 0.2s ease;

    ${ContactItem}:hover & {
        background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
        color: white;
        border-color: transparent;
        transform: scale(1.05);
    }
`;

const ItemContent = styled.div`
    flex: 1;
    min-width: 0;
`;

const ItemLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const ItemValue = styled.div`
    font-size: 1.1rem;
    font-weight: 500;
    color: #1f2937;
    line-height: 1.4;
`;

const SocialSection = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    margin-top: 1rem;
`;

const SocialTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
`;

const SocialLinks = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
`;

const SocialLink = styled.a`
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    &:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4);
    }

    &:hover::before {
        left: 100%;
    }

    &:active {
        transform: translateY(-2px) scale(1.02);
    }
`;

const ContactPage = () => {
    return (
        <MainContent>
            <ContactPageContainer>
                <ContactCard>
                    <ContactHeader>
                        <ContactTitle>Get In Touch</ContactTitle>
                        <ContactSubtitle>
                            We'd love to connect with you! Whether you have questions about our delicious recipes,
                            want to share your culinary creations, or just want to say hello - we're here for you.
                        </ContactSubtitle>
                    </ContactHeader>

                    <ContactContent>
                        <ContactSection>
                            <SectionTitle>
                                <SectionIcon>📧</SectionIcon>
                                Contact Information
                            </SectionTitle>

                            <ContactItem>
                                <ItemIcon>✉️</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Email</ItemLabel>
                                    <ItemValue>hello@foodieconnect.com</ItemValue>
                                </ItemContent>
                            </ContactItem>

                            <ContactItem>
                                <ItemIcon>📞</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Phone</ItemLabel>
                                    <ItemValue>+1 (555) FOODIE-1</ItemValue>
                                </ItemContent>
                            </ContactItem>

                            <ContactItem>
                                <ItemIcon>📍</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Address</ItemLabel>
                                    <ItemValue>
                                        123 Culinary Avenue<br />
                                        Flavor Town, FT 12345<br />
                                        United States
                                    </ItemValue>
                                </ItemContent>
                            </ContactItem>
                        </ContactSection>

                        <ContactSection>
                            <SectionTitle>
                                <SectionIcon>🕒</SectionIcon>
                                Business Hours
                            </SectionTitle>

                            <ContactItem>
                                <ItemIcon>📅</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Monday - Friday</ItemLabel>
                                    <ItemValue>9:00 AM - 8:00 PM</ItemValue>
                                </ItemContent>
                            </ContactItem>

                            <ContactItem>
                                <ItemIcon>📅</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Saturday</ItemLabel>
                                    <ItemValue>10:00 AM - 6:00 PM</ItemValue>
                                </ItemContent>
                            </ContactItem>

                            <ContactItem>
                                <ItemIcon>📅</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Sunday</ItemLabel>
                                    <ItemValue>12:00 PM - 5:00 PM</ItemValue>
                                </ItemContent>
                            </ContactItem>

                            <ContactItem>
                                <ItemIcon>🎉</ItemIcon>
                                <ItemContent>
                                    <ItemLabel>Special Note</ItemLabel>
                                    <ItemValue>Always available for food emergencies!</ItemValue>
                                </ItemContent>
                            </ContactItem>
                        </ContactSection>

                        <SocialSection>
                            <SocialTitle>
                                <SectionIcon>🌟</SectionIcon>
                                Follow Our Culinary Journey
                            </SocialTitle>
                            <SocialLinks>
                                <SocialLink href="#" title="Facebook">
                                    <FaFacebook />
                                </SocialLink>
                                <SocialLink href="#" title="Instagram">
                                    <FaInstagram />
                                </SocialLink>
                                <SocialLink href="#" title="Twitter">
                                    <FaTwitter />
                                </SocialLink>
                                <SocialLink href="#" title="YouTube">
                                    <FaYoutube />
                                </SocialLink>
                                <SocialLink href="#" title="TikTok">
                                    <FaTiktok />
                                </SocialLink>
                                <SocialLink href="#" title="Pinterest">
                                    <FaPinterest />
                                </SocialLink>
                            </SocialLinks>

                        </SocialSection>
                    </ContactContent>
                </ContactCard>
            </ContactPageContainer>
        </MainContent>
    );
};

export default ContactPage;