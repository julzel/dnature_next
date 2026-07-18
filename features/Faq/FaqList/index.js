'use client';

import { useId, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './FaqList.module.scss'

// data
import FAQ from './data'

const FaqList = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const idPrefix = useId();

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
                    <article
                        className={styles.faqQuestionBlock}
                        style={{ backgroundColor: selectedQuestion === i ? '#f2f2f2' : '#ffffff' }}
                        key={i}
                    >
                        <h3>
                          <button
                            type="button"
                            onClick={() => handleQuestionClick(i)}
                            aria-expanded={selectedQuestion === i}
                            aria-controls={`${idPrefix}-answer-${i}`}
                            style={{ borderLeftColor: selectedQuestion === i ? '#ff6f00' : 'transparent' }}
                          >
                            <span>{q.question}</span>
                            <span className={selectedQuestion === i ? styles.active : ''}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                          </button>
                        </h3>
                        <div
                            id={`${idPrefix}-answer-${i}`}
                            className={styles.answer}
                            hidden={selectedQuestion !== i}
                            style={{
                                maxHeight: selectedQuestion === i ? '800px' : '0',
                                padding: selectedQuestion === i ? '20px' : '0 20px'
                            }}
                        >
                          {q.blocks.map((block, blockIndex) => {
                            if (block.type === 'ordered-list' || block.type === 'unordered-list') {
                              const List = block.type === 'ordered-list' ? 'ol' : 'ul';
                              return <List key={blockIndex}>{block.items.map((item) => <li key={item}>{item}</li>)}</List>;
                            }

                            const content = block.content?.map((part, partIndex) =>
                              typeof part === 'string' ? part : <a key={partIndex} className="link" href={part.href}>{part.text}</a>
                            ) || block.text;
                            return <p key={blockIndex} className={block.type === 'note' ? 'small bold' : undefined}>{content}</p>;
                          })}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default FaqList
