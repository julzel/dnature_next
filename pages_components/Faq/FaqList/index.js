import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './FaqList.module.scss'

// data
import FAQ from './data'

const FaqList = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleQuestionClick = questionId => {
        if (questionId === selectedQuestion) {
            setSelectedQuestion(null)
        } else {
            setSelectedQuestion(questionId)
        }
    }

    return (
        <section className={styles.faq}>
            <div className={styles.faqList}>
                {FAQ.map((q, i) => (
                    <div
                        role="button"
                        className={styles.faqQuestionBlock}
                        style={{ backgroundColor: selectedQuestion === i ? '#f2f2f2' : '#fefefa' }}
                        key={i}
                        tabIndex="0"
                        onClick={() => handleQuestionClick(i)}
                    >
                        <h3 style={{ borderLeftColor: selectedQuestion === i ? '#ff6f00' : 'transparent' }}>
                            {q.question}
                            <span className={selectedQuestion === i ? styles.active : ''}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                        </h3>
                        <div
                            className={styles.answer}
                            dangerouslySetInnerHTML={{ __html: q.answer }}
                            style={{
                                maxHeight: selectedQuestion === i ? '800px' : '0',
                                padding: selectedQuestion === i ? '20px' : '0 20px'
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FaqList