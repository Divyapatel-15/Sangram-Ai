import React from 'react'
import { archetypes, archetypeVars } from '../data/archetypes'
import { ArchetypeIcon, IconCheck, IconArrowRight, IconPersona } from './Icons'

export default function ArchetypeCatalog({
  selected,
  activeSlot,
  setActiveSlot,
  onSelectArchetype
}) {
  const currentFighter = selected[activeSlot]
  const currentArchetype = currentFighter?.archetype
  const otherSlot = activeSlot === 0 ? 1 : 0
  const otherFighter = selected[otherSlot]

  return (
    <section className="archetype-section" aria-labelledby="archetype-h">
      <div className="archetype-header">
        <div>
          <div className="archetype-eyebrow">
            <IconPersona size={13} />
            <span>COGNITIVE ARCHETYPES</span>
          </div>
          <h2 id="archetype-h">Choose Debate Personalities</h2>
          <p className="archetype-sub">
            Assign distinct philosophical archetypes to each model to define their argumentative angle, critical lenses, and reasoning patterns.
          </p>
        </div>

        {/* Slot selector switcher */}
        <div className="archetype-slot-switch" role="tablist" aria-label="Select fighter slot to configure archetype">
          {[0, 1].map((slot) => {
            const f = selected[slot]
            const arch = f?.archetype
            const isActive = activeSlot === slot
            return (
              <button
                key={slot}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`arch-slot-btn ${isActive ? 'active' : ''}`}
                style={arch ? archetypeVars(arch) : undefined}
                onClick={() => setActiveSlot(slot)}
              >
                <span className="arch-slot-num">FIGHTER 0{slot + 1}</span>
                <span className="arch-slot-name">
                  <strong>{f?.name || 'Empty'}</strong>
                  {arch && <small>· {arch.shortName}</small>}
                </span>
                {arch && (
                  <span className="arch-slot-icon" aria-hidden="true">
                    <ArchetypeIcon id={arch.id} size={15} color={arch.accent.color} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Target status bar */}
      <div className="arch-target-bar">
        <span>
          Configuring personality for: <strong>Fighter 0{activeSlot + 1} {currentFighter?.name ? `(${currentFighter.name})` : '(No model selected yet)'}</strong>
        </span>
        {currentArchetype && (
          <span className="arch-active-summary">
            Active: <strong>{currentArchetype.name}</strong> ({currentArchetype.tag})
          </span>
        )}
      </div>

      {/* Archetype Cards Grid */}
      <div className="archetype-grid">
        {archetypes.map((arch) => {
          const isSlot0 = selected[0]?.archetype?.id === arch.id
          const isSlot1 = selected[1]?.archetype?.id === arch.id
          const isCurrentSlot = (activeSlot === 0 && isSlot0) || (activeSlot === 1 && isSlot1)
          const isOtherSlot = (activeSlot === 0 && isSlot1) || (activeSlot === 1 && isSlot0)

          return (
            <button
              key={arch.id}
              type="button"
              className={`arch-card ${isCurrentSlot ? 'active' : ''} ${isOtherSlot ? 'occupied-other' : ''}`}
              style={archetypeVars(arch)}
              onClick={() => onSelectArchetype(arch, activeSlot)}
              aria-pressed={isCurrentSlot}
              aria-label={`${arch.name}: ${arch.tag}. ${arch.motto} ${isCurrentSlot ? `Currently assigned to Fighter 0${activeSlot + 1}.` : `Assign to Fighter 0${activeSlot + 1}.`}`}
            >
              <div className="arch-card-top">
                <div className="arch-icon-wrap" aria-hidden="true">
                  <ArchetypeIcon id={arch.id} size={22} color={arch.accent.color} />
                </div>
                <div className="arch-title-wrap">
                  <span className="arch-name">{arch.name}</span>
                  <span className="arch-tag">{arch.tag}</span>
                </div>
              </div>

              <blockquote className="arch-motto">“{arch.motto}”</blockquote>

              <p className="arch-desc">{arch.description}</p>

              <div className="arch-traits-wrap" aria-label="Key traits">
                {arch.traits.map((t) => (
                  <span key={t} className="arch-trait-item">{t}</span>
                ))}
              </div>

              <div className="arch-card-foot">
                {isCurrentSlot ? (
                  <span className="arch-foot-active">
                    <IconCheck size={13} />
                    <span>Active for Fighter 0{activeSlot + 1}</span>
                  </span>
                ) : isOtherSlot ? (
                  <span className="arch-foot-other">
                    <span>Used on Fighter 0{otherSlot + 1} · Click to set for Fighter 0{activeSlot + 1}</span>
                  </span>
                ) : (
                  <span className="arch-foot-cta">
                    <span>Assign to Fighter 0{activeSlot + 1}</span>
                    <IconArrowRight size={13} />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
