function collapseSidebar() {
  // Select the .wrapper class
  const wrapper = document.querySelector('.admin-wrapper');
  // Add .wrapper-mini class
  if (wrapper.classList.contains('admin-wrapper-maxi')) {
    wrapper.classList.remove('admin-wrapper-maxi');
    wrapper.classList.add('admin-wrapper-mini');
  } else {
    wrapper.classList.add('admin-wrapper-mini');
  }
}
const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
sidebarToggleBtn.addEventListener('click', collapseSidebar, true);


function expandSidebar() {
  // Select the .wrapper class
  const wrapper = document.querySelector('.admin-wrapper');
  // Add .wrapper-mini class
  if (wrapper.classList.contains('admin-wrapper-mini')) {
    wrapper.classList.remove('admin-wrapper-mini');
    wrapper.classList.add('admin-wrapper-maxi');
  } else {
    wrapper.classList.add('admin-wrapper-maxi');
  }
}
const adminMenuIcon = document.querySelector('.admin-menu-icon');
adminMenuIcon.addEventListener('click', expandSidebar, true);

function setAdminWrapperSize(e) {
  if (this.innerWidth < 770) {
    collapseSidebar();
  } else {
    expandSidebar();
  }
}
window.addEventListener('load', setAdminWrapperSize, true);
window.addEventListener('resize', setAdminWrapperSize, true);