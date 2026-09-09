/** De React-contexten staan bewust in een apart, klein bestand.
 *
 *  Reden: tijdens ontwikkelen vervangt Vite een bewerkt bestand hot. Als het
 *  context-object in hetzelfde bestand zou staan als de provider, dan maakt zo'n
 *  hot-vervanging een níeuw context-object aan terwijl al gekoppelde componenten
 *  nog naar het oude kijken — en dan valt de app om met "moet binnen een
 *  ProjectProvider gebruikt worden". Dit bestand verandert vrijwel nooit, dus
 *  blijft het context-object hetzelfde.
 */

import { createContext } from 'react';

export const ProjectContext = createContext(null);
export const ToastContext = createContext(null);
