
export function initialsGenerator(fullName: string) {
    if (!fullName.trim()) return '';
  
    const slices = fullName.trim().split(/\s+/);
    let initials = '';
  
    if (slices.length === 2) {
      initials = slices[0][0] + slices[1][0];
    } else if (slices.length > 2) {
      initials = slices[0][0] + slices[slices.length - 1][0];
    }
  
    return initials.toUpperCase();
  }